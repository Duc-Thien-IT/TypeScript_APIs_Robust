  import express, { Request, Response, NextFunction } from 'express';
  import routes from './routes/routes';
  import path from 'path';

  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());
  app.use(express.static(path.join(__dirname, '../public')));
  app.use('/tasks', routes);

  app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
    //res.send('Hello, TypeScript Express!');
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      res.status(500).send('Something went wrong');
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
