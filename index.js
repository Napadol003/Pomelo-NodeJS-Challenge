'use strict';

const Hapi = require('@hapi/hapi');
const fs = require('fs');
const { finished } = require('stream');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    //read JSON file name input
    fs.readFile('input.json', (err, data) => {

        //if could not find this find name throw error
        if (err) throw err;

        // input is JSON which parse for using in this js file
        let input = JSON.parse(data);

        //if the first parent is not != 1 then throw error
        if(input[0].length != 1) throw err;

        //for using in loop to add child to their parent
        var a = 1;

        //keyCount for count number of object array in JSON file
        var keyCount  = Object.keys(input).length;

        //loop for add child to their parent which its concept is adding from the last level (keyCount-1)
        //then go up each level until it reach to the upper one (level 0)
        for(var i=0; i<keyCount-1; i++){   
            for(var j=0; j<input[keyCount-a].length; j++){
                for(var k=0; k<input[keyCount-a-1].length; k++){
                    if(input[keyCount-a][j].parent_id == input[keyCount-a-1][k].id){
                        input[keyCount-a-1][k].children.push(input[keyCount-a][j]);
                    }
                }
            }

            //when finish adding all of child to their parent then write JSON file name "output" 
            if(i==keyCount-a){
                fs.writeFile('output.json', JSON.stringify(input[0], null, 1), finished);
            } else { a++; }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Hi everyone!!';
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
