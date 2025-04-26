import { Request, Response, NextFunction } from 'express';
import Docker from 'dockerode';
import { AppError } from '../middleware/errorHandler';

const docker = new Docker();

export const runCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.body;

    // Create a temporary container
    const container = await docker.createContainer({
      Image: 'node:latest',
      Cmd: ['node', '-e', code],
      Tty: false,
      AttachStdout: true,
      AttachStderr: true,
    });

    // Start the container
    await container.start();

    // Get the output
    const stream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
    });

    let output = '';
    stream.on('data', (chunk) => {
      output += chunk.toString();
    });

    // Wait for the container to finish
    await container.wait();

    // Remove the container
    await container.remove();

    res.status(200).json({
      status: 'success',
      output,
    });
  } catch (error) {
    next(new AppError('Error executing code', 500));
  }
}; 