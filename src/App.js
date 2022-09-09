const express = require("express");
const server = express();
const cors = require("cors");
const fs = require("fs");
const encode = require("node-base64-image").encode;
const decode = require("node-base64-image").decode;
const { PredictionServiceClient } = require("@google-cloud/automl").v1;
server.use(express.json());

server.use(cors())

const client = new PredictionServiceClient({
    keyFilename: "../mission2protoype-f9dd4d3f24bf.json",
});

const projectId = "mission2protoype";
const location = "us-central1";
const modelId = "ICN277412281246023680";
const filePath = "./car.png";

server.use("/", function (req, res) {
    const imageURL = req.query.url;
    res.send(global.payload);

    predict(imageURL);

    async function predict() {
        const options = {
            string: true,
            headers: {
                "User-Agent": "my-app",
            },
        };

        const image = await encode(imageURL, options);

        await decode(image, { fname: "car", ext: "png" });

        fs.writeFileSync("imageURL.txt", image);

        const content = fs.readFileSync(filePath);
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
            console.log(`consoling carType`, annotationPayload.displayName);
            global.payload = response.payload;
            global.car = annotationPayload.displayName;
            global.car1 = annotationPayload.displayName;
        }
    }
});

const PORT = 4000;

server.listen(PORT, function () {
    console.log("listening to port", PORT);
});