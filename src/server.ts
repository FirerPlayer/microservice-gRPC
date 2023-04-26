import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { join } from "path";
import { ProtoGrpcType } from "./rpc/chat";
import { ChatServiceHandlers } from "./rpc/chat_package/ChatService";

const packageDefinition = protoLoader.loadSync(join(__dirname, "chat.proto"));

const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const handlres: ChatServiceHandlers = {
  Chat: (call, callback) => {
    const { chatId, message } = call.request;
    callback(null, {
      id: chatId,
      message: {
        id: 1,
        message: message,
        createdAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    });
  },
  ChatStream: (call) => {
    const { chatId, message } = call.request;
    const numbersIncresing: number[] = [...Array(20).keys()];
    numbersIncresing.forEach((number, key) => {
      const finalMessage = message.concat(`, the number is ${number}`);
      setTimeout(() => {
        call.write({
          id: chatId,
          message: {
            id: number,
            message: finalMessage,
            createdAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
        });
      }, key * 1000);
    });
  },
};

const server = new grpc.Server();
server.addService(proto.chat_package.ChatService.service, handlres);

server.bindAsync(
  "0.0.0.0:5051",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`server started at http://localhost:${port}`);
    server.start();
  }
);
