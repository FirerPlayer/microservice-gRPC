import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { join } from "path";
import { ProtoGrpcType } from "./rpc/chat";
import { ChatServiceHandlers } from "./rpc/chat_package/ChatService";
import { ChatResponse } from "rpc/chat_package/ChatResponse";

const packageDefinition = protoLoader.loadSync(join(__dirname, "chat.proto"));

const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const client = new proto.chat_package.ChatService(
  "localhost:5051",
  grpc.credentials.createInsecure()
);

client.Chat(
  { chatId: 1, message: "Hello aspfguhaspfguhasgpoiuhg0293q1478tgh234guhegf" },
  (err, response) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("A menssagem foi recebida com sucesso!");
    console.log("Message id: ", response?.id);
    console.log("Message: ", response?.message);
    console.log(" Created at: ", response?.createdAt);
  }
);

const stream = client.ChatStream({ chatId: 4, message: "Denis is the guy" });

stream.on("data", (data: ChatResponse) => {
  console.log("Response received: ", data.message?.message);
});
