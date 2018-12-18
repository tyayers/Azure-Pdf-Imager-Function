var pdf2png = require('pdf2png-mp2');
//const fs = require('fs');

module.exports = async function (context, myBlob) {
    context.log("JavaScript blob trigger function processing PDF blob \n Name:", context.bindingData.name, "\n Blob Size:", myBlob.length, "Bytes");

    var jobStatus = {finished: false};

    if (context.bindingData.name.toUpperCase().endsWith(".PDF")) 
    {
        convertPdf(context, myBlob, jobStatus);

        while(!jobStatus.finished) {
            await sleep(200);
        }

        console.log("Finished processing PDF " + context.bindingData.name);
    }
    else {
        console.log("File isn't a PDF file, can't process..");
    }
};

function convertPdf(context, myBlob, jobStatus) {
    pdf2png.convert(myBlob, function(resp){
        if(resp.success)
        {
            console.log("Finished converting PDF: " + context.bindingData.name);
            context.bindings.myOutputBlob = resp.data[1];
        }
        else {
            console.error("ERROR converting PDF: " + context.bindingData.name + " - " + resp.error);
        }

        jobStatus.finished = true;

        // Following code can be used to test conversion, writes converted PNG to local directory
        // Don't forget to uncomment the require('fs') at the top of the file as well
        // fs.writeFile("c:/Temp/example_simple.png", resp.data[1], function(err) {
        //     if(err) {
        //         console.log(err);
        //     }
        //     else {
        //         console.log("The file was saved!");
        //     }
        // });
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }