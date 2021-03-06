"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = template;
function template(body) {
  return "<!DOCTYPE HTML>\n<html>\n<head>\n  <meta charset=\"UTF-8\" />\n  <title>Pro MERN Stack</title>\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <link rel=\"stylesheet\" href=\"/bootstrap/css/bootstrap.min.css\" >\n  <style>\n    .panel-title a {display: block; width: 100%; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <div id=\"contents\">" + body + "</div>    <!-- this is where our component will appear -->\n  <script src=\"/vendor.bundle.js\"></script>\n  <script src=\"/app.bundle.js\"></script>\n</body>\n</html>\n";
}
//# sourceMappingURL=template.js.map