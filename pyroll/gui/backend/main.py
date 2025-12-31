from enum import Enum
from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional, Union

from simulation import get_rollpass_contour, get_in_profile_contour
from simulation.pyroll_basic_runner import run_pyroll_simulation, validate_parameters


class SolveMethod(str, Enum):
    STANDARD = "solve"
    FORWARD = "solve_forward"
    BACKWARD = "solve_backward"

class StandardSolveParams(BaseModel):
    pass

class ForwardSolveParams(BaseModel):
    in_velocity: float = Field(..., description="Incoming Profile Velocity")

class BackwardSolveParams(BaseModel):
    out_cross_section: float = Field(..., description="Final Profile Area")
    out_velocity: float = Field(..., description="Final Profile Velocity")

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
    solve_method: SolveMethod = SolveMethod.STANDARD
    solve_params: Union[StandardSolveParams, ForwardSolveParams, BackwardSolveParams] = Field(
        default_factory=StandardSolveParams
    )


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
            in_profile_data=data.inProfile,
            solve_method=data.solve_method.value,  # Convert Enum to string value
            solve_params=data.solve_params
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