import config from './config/config.js';
import createApolloServer from './app.js';
import { runAllMigrations } from './db/migrationRunner.js';

async function startServer() {
  try {
    // Run database migrations before starting the server
    await runAllMigrations();

    const { httpServer } = await createApolloServer();
    const port = config.port || 5000;

    await new Promise((resolve) => httpServer.listen({ port }, resolve));

    console.log(`🚀 Server ready at http://localhost:${port}`);
    console.log(`🚀 GraphQL endpoint: http://localhost:${port}/graphql`);
    console.log(`🩺 Health check: http://localhost:${port}/health`);

    return { httpServer };
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // In a real app, you might want to shut down the server
  // server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer().catch((error) => {
  console.error('Fatal error during server startup:', error);
  process.exit(1);
});
