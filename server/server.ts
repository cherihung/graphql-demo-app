import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

export class Server {

    public app: express.Application;
    public server;
    public PORT: number = parseInt(process.env.PORT as string) || 3000;

    constructor() {
        this.app = express();
        this.config();        
    }

    /**
     * Configure the express app.
     */
    private config(): void {
        this.app.use(cors());
        // this.app.options("/server/*", cors());

        // GraphiQL, a visual editor for queries
        this.app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json({limit: "250mb"}));

        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.header("Content-Type", "application/json");
            next();
        });

    }

//     // Start the server
// app.listen(3000, () => {
//     console.log('Go to http://localhost:3000/graphiql to run queries!');
//   });
  

    /**
     * Start the server
     * @returns {Promise<any>}
     */
    public start(schema: any): Promise<{}> {

        // The GraphQL endpoint
        this.app.use('/graphql', bodyParser.json(), graphqlExpress({ 
            schema
            // tracing: true,
            // cacheControl: true
        }));

        return new Promise<{}>((resolve, reject) => {
            this.server = this.app.listen(this.PORT, (err: {}) => {
                if (err) {
                    return reject(err);
                }
                console.log('Go to http://localhost:3000/graphiql to run queries!');

                return resolve();
            });
        });

    }

    /**
     * Stop the server (if running).
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (this.server) {
                this.server.close(() => {
                    return resolve(true);
                });
            } else {
                return resolve(true);
            }
        });
    }

}