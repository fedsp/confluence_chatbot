# confluence_chatbot
A simple chatbot that allows users to query content in a confluence project.


#To run the front end locally:
1. Open the cmd and navigate to the /frontend folder
2. Run 
```bash
python -m http.server
```
3. Navigate to localhost://8000

#To run the backend locally:
1. Open the cmd and navigate to the /backend folder
2. Run 
```bash
uvicorn main:app --reload --port 5000
```
3. The backend is ready to receive rest API calls at http://127.0.0.1:5000