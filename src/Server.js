const projectId = "mission2protoype";
const location = "us-central1";
const modelId = "ICN277412281246023680";
const filePath = "./vehicles/suv/7.jpg";
const { PredictionServiceClient } = require("@google-cloud/automl").v1;
const fs = require("fs");

const client = new PredictionServiceClient({
    keyFilename: "./mission2protoype-f9dd4d3f24bf.json",
});

const content = fs.readFileSync(filePath);

async function predict() {
    const request = {
        name: client.modelPath(projectId, location, modelId),
        payload: {
            image: {
                imageBytes: content,
            },
        },
    };

    const [response] = await client.predict(request);

    for (const annotationPayload of response.payload) {

        console.log(`type of vehicle: ${annotationPayload.displayName}`);
        const carType = annotationPayload.displayName;
    }
}

predict();