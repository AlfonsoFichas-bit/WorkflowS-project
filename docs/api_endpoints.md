# API Endpoints Documentation

This document provides a detailed overview of the available endpoints in the Project Management API.

## Authentication

### POST /login

-   **Description:** Authenticates a user and returns a JWT token.
-   **Request Body:**
    ```json
    {
        "correo": "user@example.com",
        "contraseña": "password123"
    }
    ```
-   **Response (200 OK):**
    ```json
    {
        "token": "your_jwt_token"
    }
    ```

---

## Projects

### GET /api/projects

-   **Description:** Retrieves a list of all projects.
-   **Authentication:** Required.
-   **Response (200 OK):** An array of project objects.

### POST /api/projects

-   **Description:** Creates a new project.
-   **Authentication:** Required.
-   **Request Body:**
    ```json
    {
        "name": "New Project Name",
        "description": "A brief description of the project."
    }
    ```
-   **Response (201 Created):** The newly created project object.

---

## Tasks

### GET /api/userstories/{storyId}/tasks

-   **Description:** Retrieves all tasks for a specific user story.
-   **Authentication:** Required.
-   **Response (200 OK):** An array of task objects.

### PUT /api/tasks/{taskId}/status

-   **Description:** Updates the status of a specific task.
-   **Authentication:** Required.
-   **Request Body:**
    ```json
    {
        "status": "in_progress"
    }
    ```
-   **Response (200 OK):** The updated task object.

### GET /api/tasks/{id}/comments

-   **Description:** Retrieves all comments for a specific task, ordered by creation time.
-   **Authentication:** Required.
-   **URL Parameters:**
    -   `id`: The ID of the task.
-   **Response (200 OK):** An array of comment objects.
    ```json
    [
        {
            "ID": 1,
            "TaskID": 123,
            "AuthorID": 45,
            "Content": "This is a test comment.",
            "CreatedAt": "2025-11-10T14:30:00Z",
            "UpdatedAt": "2025-11-10T14:30:00Z",
            "Author": {
                "ID": 45,
                "Nombre": "John Doe",
                ...
            }
        }
    ]
    ```

---

## Reports

### GET /api/sprints/{id}/reports/commitment

-   **Description:** Retrieves a commitment vs. completed report for a specific sprint. It calculates the total story points committed to the sprint and how many of those have been completed.
-   **Authentication:** Required.
-   **URL Parameters:**
    -   `id`: The ID of the sprint.
-   **Response (200 OK):** A commitment report object.
    ```json
    {
        "sprintId": 1,
        "sprintName": "Commitment Sprint",
        "committedPoints": 16,
        "completedPoints": 8,
        "completionRate": 50.0
    }
    ```

---

## Task Evaluations (New)

### POST /api/tasks/{taskId}/evaluations

-   **Description:** Creates a new evaluation for a specific task. Only users with the 'docente' role can perform this action.
-   **Authentication:** Required.
-   **URL Parameters:**
    -   `taskId`: The ID of the task to be evaluated.
-   **Request Body:**
    ```json
    {
        "rubricId": 1,
        "overallFeedback": "Excellent work on the task!",
        "criterionEvaluations": [
            {
                "criterionId": 1,
                "score": 5,
                "feedback": "The implementation was flawless."
            },
            {
                "criterionId": 2,
                "score": 4,
                "feedback": "Documentation could be slightly more detailed."
            }
        ]
    }
    ```
-   **Response (201 Created):** The newly created evaluation object.
-   **Error Responses:**
    -   `400 Bad Request`: If the task ID is invalid or the payload is malformed.
    -   `401 Unauthorized`: If the user is not authenticated.
    -   `500 Internal Server Error`: If the user does not have permission ('docente' role), or if other server-side errors occur.

### GET /api/tasks/{taskId}/evaluations

-   **Description:** Retrieves all evaluations associated with a specific task.
-   **Authentication:** Required.
-   **URL Parameters:**
    -   `taskId`: The ID of the task.
-   **Response (200 OK):** An array of evaluation objects.
    ```json
    [
        {
            "ID": 1,
            "TaskID": 1,
            "EvaluatorID": 2,
            "RubricID": 1,
            "OverallFeedback": "Excellent work on the task!",
            "TotalScore": 9.0,
            "Status": "published",
            "Evaluator": { ... },
            "Rubric": { ... },
            "CriterionEvaluations": [ ... ]
        }
    ]
    ```
-   **Error Responses:**
    -   `400 Bad Request`: If the task ID is invalid.
    -   `401 Unauthorized`: If the user is not authenticated.
