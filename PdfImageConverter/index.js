var pdf2png = require('pdf2png-mp');
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

        context.log("Finished processing PDF " + context.bindingData.name);
    }
    else {
        context.log("File isn't a PDF file, can't process..");
    }
};

function convertPdf(context, myBlob, jobStatus) {
    pdf2png.convert(myBlob, function(resp)
    {
        if(resp.success)
        {
            context.log("Finished converting PDF: " + context.bindingData.name);
            //context.bindings.myOutputBlob = resp.data[1];

            resp.data.forEach(function(item, index) {

                var fileNameNoExt = content.bindingData.name.slice(0,-4);
                
                var fileName = fileNameNoExt+'_'+index+".png";
                
                context.log("FILE " + filename);
                // Following code can be used to test conversion, writes converted PNG to local directory
                // Don't forget to uncomment the require('fs') at the top of the file as well
                // fs.writeFile("c:/Temp/blob/example_simple.png", resp.data[1], function(err) {
                //     if(err) {
                //         context.log(err);
                //     }
                //     else {
                //         context.log("The file was saved!");
                //     }
                // });
            });
        }
        else {
            context.log("ERROR converting PDF: " + context.bindingData.name + " - " + resp.error);
        }

        jobStatus.finished = true;
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }