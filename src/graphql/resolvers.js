// In-memory data store for demonstration
const samples = [
  {
    id: '1',
    name: 'Sample 1',
    description: 'First sample',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sample 2',
    description: 'Second sample',
    createdAt: new Date().toISOString()
  }
];

const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL!',
    getSample: (_, { id }) => {
      return samples.find(sample => sample.id === id);
    },
    getAllSamples: () => {
      return samples;
    },
  },
  Mutation: {
    createSample: (_, { name, description }) => {
      const newSample = {
        id: String(samples.length + 1),
        name,
        description,
        createdAt: new Date().toISOString()
      };
      samples.push(newSample);
      return newSample;
    },
  },
};

export default resolvers;
