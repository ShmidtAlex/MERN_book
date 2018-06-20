export default function template(body) {
  return `<!DOCTYPE HTML>
  <html>
    <head>
      <meta charset="UTF-8"/>
      <title> Issue Tracker </title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css" >
      <style>
        .pannel-title a {
          display:block; width:100%; cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div id="contents">${body}</div>
      <script src="/vendor.bundle.js"></script>
      <script src="/app.bundle.js"></script>
    </body>
  </html>
  `;
}