import sys
try:
    from backend.app.main import app
    import uvicorn
    print("Backend imports succeeded cleanly!")
except Exception as e:
    print("Error during import:", e)
    import traceback
    traceback.print_exc()
