from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from simulation import get_rollpass_contour
app = FastAPI(title="PyRolL-Basic")

# CORS für React-Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
)


class PassDesignData(BaseModel):
    passDesignData: List[Dict[str, Any]]


class SimulationResponse(BaseModel):
    success: bool
    input_data: List[Dict[str, Any]]
    pyroll_results: Optional[Dict[str, Any]] = None
    errors: Optional[str] = None


@app.get("/")
def read_root():
    return {
        "status": "API running",
        "version": "1.0",
        "endpoints": ["/api/simulate"]
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/api/simulate", response_model=SimulationResponse)
async def run_simulation(data: PassDesignData):
    """
    Führt die PyRoll Simulation mit den übergebenen PassDesign Parametern aus
    """
    try:
        params = data.passDesignData

        # Hier Parameter aus der Tabelle extrahieren
        # Beispiel:
        # durchmesser = next((p['wert'] for p in params if p['parameter'] == 'Durchmesser'), None)
        # geschwindigkeit = next((p['wert'] for p in params if p['parameter'] == 'Geschwindigkeit'), None)

        # TODO: Hier deine PyRoll Simulation aufrufen
        # from simulation.pyroll_runner import run_pyroll_simulation
        # result = run_pyroll_simulation(params)

        # Dummy-Ergebnis für Tests
        result = {
            "erfolg": True,
            "ausgabeParameter": {
                "kraft": 1250.5,
                "moment": 450.3,
                "leistung": 85.7
            },
            "diagrammDaten": {
                "x": [0, 1, 2, 3, 4, 5],
                "y": [0, 10, 25, 45, 70, 100]
            }
        }

        return SimulationResponse(
            success=True,
            input_data=params,
            pyroll_results=result
        )

    except Exception as e:
        return SimulationResponse(
            success=False,
            input_data=data.passDesignData,
            errors=str(e)
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

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)