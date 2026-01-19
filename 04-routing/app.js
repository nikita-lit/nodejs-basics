const url = require('url');
const fs = require("fs");

function renderHTML(path, response)
{
    fs.readFile(path, null, function(error, data) {
        if (error)
        {
            response.writeHead(404);
            response.write('File not found!');
        }
        else
        {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data);
        }

        response.end();
    });
}

module.exports = {
    handleRequest: function(request, response)
    {
        let path = new URL(request.url, `https://${request.headers.host}`).pathname;
        switch(path)
        {
            case '/':
                renderHTML('./index.html', response);
                break;
            case '/login':
                renderHTML('./login.html', response);
                break;
            default:
                response.writeHead(404);
                response.write('Route not defined!');
                response.end();
                break;
        }
    }
}