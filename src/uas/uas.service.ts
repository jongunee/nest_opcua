import { Injectable } from '@nestjs/common';
import { ServerState } from 'node_modules/node-opcua-types';
import { OPCUAServer } from 'node_modules/node-opcua-server';
import { constructNodesetFilename } from 'node-opcua-nodesets';
import { BrowseResponse } from 'node-opcua-service-browse';

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
    const browseResponse = BrowseResponse;
    browseResponse.re;
    // return 'uaGetNodes';
  }
}
