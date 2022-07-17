import { Injectable } from '@nestjs/common';
import { ServerState } from 'node_modules/node-opcua-types';
import { OPCUAServer } from 'node_modules/node-opcua-server';
import { constructNodesetFilename } from 'node-opcua-nodesets';
import { 
  BrowseDescriptionLike, 
  ClientSessionBrowseService, 
  ConnectionStrategyOptions, 
  OPCUAClientOptions, 
  MessageSecurityMode, 
  SecurityPolicy, 
  OPCUAClient, 
  BrowseResult 
} from 'node-opcua-client';
import { response } from 'express';


@Injectable()
export class UasService {
  uaCreate() {
    (async () => {
      try {
        const xmlfile = constructNodesetFilename('test.xml');
        const nodeset2file = constructNodesetFilename('Opc.Ua.NodeSet2.xml');

        const server = new OPCUAServer({
          port: 26543,
          nodeset_filename: [xmlfile, nodeset2file],
        });
        await server.start();
        const endpointUrl =
          server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(' server is ready on ', endpointUrl);
        console.log('CTRL+C to stop');

        process.on('SIGINT', () => {
          if (server.engine.serverStatus.state === ServerState.Shutdown) {
            console.log(
              'Server shutdown already requested... shutdown will happen in ',
              server.engine.serverStatus.secondsTillShutdown,
              'second',
            );
            return;
          }
          console.log(' Received server interruption from user ');
          console.log(' shutting down ...');

          server.shutdown(10000, () => {
            console.log(' shutting down completed ');
            console.log(' done ');
            process.exit(0);
          });
        });
      } catch (err) {
        console.log('error', err);
        process.exit(-1);
      }
    })();
  }

  uaGetNodes() {
    (async () => {
      const endpointUri = "opc.tcp://DESKTOP-BHP1M33:26543";
      const connectionStrategy: ConnectionStrategyOptions = {
        initialDelay: 1000,
        maxRetry: 1
      };
      const options: OPCUAClientOptions = {
          applicationName: "ClientBrowseNextDemo",
          connectionStrategy,
          securityMode: MessageSecurityMode.None,
          securityPolicy: SecurityPolicy.None
      };
      
      const client = OPCUAClient.create(options);
      await client.connect(endpointUri);
      const session = client.createSession();
  
      const nodeToBrowse: BrowseDescriptionLike = {
        nodeId: "ns=0;i=2253",
        browseDirection: 0
      };
      
      // let clientSessionBrowseService :ClientSessionBrowseService;
      // let browseResult = clientSessionBrowseService.browse(nodeToBrowse);
      let browseedReferences = (await (await session).browse(nodeToBrowse)).references[1]['nodeId'];
      let browsedNs = browseedReferences['namespace'];
      let browsedId = browseedReferences['value'];
      console.log("BrowseResult = Namespace: %d, Identifier: %d", browsedNs, browsedId);
      // console.log("BrowseResult = ", (await browseResult));
  
      let nodeIdToRead = "ns=" + browsedNs + ";i=" + browsedId;
      console.log(nodeIdToRead);
      let attribute = (await (await session).read({nodeId: nodeIdToRead})).value;
      console.log(attribute);

      // console.log((await (await session).browse(nodeToBrowse)).references);
      let att = {
        dataType: attribute['dataType'],
        arrType: attribute['arrType'],
        value: attribute['value'],
        dimensions: attribute['dimensions']
      };
   
      
      // return JSON.stringify(att);
      return att;
    })();
  }
}
