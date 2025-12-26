from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from simulation import get_rollpass_contour, get_in_profile_contour
from simulation.pyroll_basic_runner import run_pyroll_simulation, validate_parameters

app = FastAPI(title="PyRolL-Basic")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimulationRequest(BaseModel):
    inProfile: Dict[str, Any]
    passDesignData: List[Dict[str, Any]]


class SimulationResponse(BaseModel):
    success: bool
    input_data: Optional[List[Dict[str, Any]]] = None
    pyroll_results: Optional[Dict[str, Any]] = None
    errors: Optional[str] = None


@app.get("/")
def read_root():
    return {
        "status": "API running",
        "version": "1.0",
        "endpoints": ["/api/simulate", "/api/rollpass-contour", "/api/inprofile-contour"]
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/api/simulate", response_model=SimulationResponse)
async def run_simulation(data: SimulationRequest):
    try:

        result = run_pyroll_simulation(
            units=data.passDesignData,
            in_profile_data=data.inProfile
        )

        return SimulationResponse(
            success=True,
            input_data=data.passDesignData,
            pyroll_results=result
        )

    except Exception as e:
        import traceback
        return SimulationResponse(
            success=False,
            input_data=data.passDesignData,
            errors=f"{str(e)}\n\n{traceback.format_exc()}"
        )


@app.get("/api/parameters")
def get_default_parameters():
    return {
        "defaultParameters": [
            {"id": 1, "parameter": "Durchmesser", "wert": 50, "einheit": "mm"},
            {"id": 2, "parameter": "Geschwindigkeit", "wert": 100, "einheit": "m/s"},
            {"id": 3, "parameter": "Temperatur", "wert": 200, "einheit": "°C"},
            {"id": 4, "parameter": "Druck", "wert": 5, "einheit": "bar"},
            {"id": 5, "parameter": "Abstand", "wert": 10, "einheit": "mm"},
            {"id": 6, "parameter": "Winkel", "wert": 45, "einheit": "°"},
        ]
    }


@app.post("/api/rollpass-contour")
async def rollpass_contour(data: dict):
    try:
        contour = get_rollpass_contour(data)
        return contour

    except Exception as e:
        import traceback
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }


@app.post("/api/inprofile-contour")
async def inprofile_contour(data: dict):
    try:
        contour = get_in_profile_contour(data)
        return contour

    except Exception as e:
        import traceback
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)