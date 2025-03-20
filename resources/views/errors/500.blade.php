<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 Not Found</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f9f9f9;
            color: #333;
            text-align: center;
        }
        .container {
            max-width: 600px;
        }
        h1 {
            font-size: 64px;
            margin: 0;
        }
        p {
            font-size: 18px;
            margin: 10px 0 20px;
        }
        a {
            text-decoration: none;
            color: #007bff;
            font-weight: bold;
            border: 2px solid #007bff;
            padding: 10px 20px;
            border-radius: 25px;
            transition: 0.3s;
        }
        a:hover {
            background: #007bff;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>500</h1>
        <p>Something Wrong</p>
        <a href="{{ url('/') }}">Back to Home</a>
    </div>
</body>
</html>
