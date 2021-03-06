export default function template(body, initalState) {
  return `<!DOCTYPE HTML>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Pro MERN Stack</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css" >
  <link rel="stylesheet" href="/bootstrap/react-select/react-select.css" >
  <style>
    .panel-title a {display: block; width: 100%; cursor: pointer; }
  </style>
</head>
<body>
  <div id="contents">${body}</div>    <!-- this is where our component will appear -->
  <script> window.__INITIAL_STATE__ = ${JSON.stringify(initalState)};</script>
  <script src="https://apis.google.com/js/api:client.js"></script>
  <script src="/vendor.bundle.js"></script>
  <script src="/app.bundle.js"></script>
  <script src="/config.js"></script>
</body>
</html>
`;
}