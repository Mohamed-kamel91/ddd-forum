import { Server as HttpServer } from 'http';
import express, { Express } from 'express';
import cors from 'cors';

import { BaseRouter } from './base-router';
import { ErrorHandler } from '../errors';

interface WebServerConfig {
  port: number;
  env: string;
}

export class WebServer {
  private readonly app: Express;
  private server: HttpServer | undefined;

  constructor(
    private config: WebServerConfig,
    private routers: BaseRouter[],
    private errorHandler: ErrorHandler,
  ) {
    this.app = express();
    this.addMiddlewares();
    this.registerRoutes();
    this.setUpErrorHandler();
  }

  public getApp() {
    return this.app;
  }

  public start() {
    return new Promise((resolve, reject) => {
      const port = this.config.port;

      this.server = this.app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        resolve(this.server);
      });

      this.server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          console.log('Port already in use');
        }

        reject(error);
      });

      this.enableGracefulShutdown(this.server);
    });
  }

  public stop() {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        reject('Server not started');
        return;
      }

      this.server.close((error) => {
        if (error) {
          reject('Server failed to stop');
          return;
        }

        resolve('Server stopped');
      });
    });
  }

  private addMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private registerRoutes(): void {
    this.routers.forEach((router) => {
      router.register();
      this.app.use(router.basePath, router.getRouter());
    });
  }

  private setUpErrorHandler() {
    this.app.use(this.errorHandler);
  }

  private enableGracefulShutdown(httpServer: HttpServer): void {
    const gracefulShutdown = () => {
      console.log('Received kill signal, shutting down gracefully');
      httpServer.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
      });

      setTimeout(() => {
        console.error(
          'Could not close connections in time, forcefully shutting down',
        );
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  }
}
