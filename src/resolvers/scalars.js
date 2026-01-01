
import { GraphQLScalarType, Kind } from 'graphql';

const flexibleStringScalar = new GraphQLScalarType({
    name: 'FlexibleString',
    description: 'A custom scalar that accepts Strings, Numbers, Arrays, or Objects and converts them to String',
    serialize(value) {
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return String(value); // Convert outgoing value to string
    },
    parseValue(value) {
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return String(value); // Convert incoming value to string
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING || ast.kind === Kind.INT || ast.kind === Kind.FLOAT) {
            return String(ast.value);
        }
        if (ast.kind === Kind.LIST) {
            // Best effort to convert list AST back to array then stringify
            // This is a bit complex for AST, but for simple scalar inputs it might be enough to just return it as a string representation or null if too complex.
            // For now, let's process basic lists if possible, otherwise null. 
            // Actually, for bulk upload variables (JSON), parseValue is used, not parseLiteral. 
            // parseLiteral is used when the value is hardcoded in the query string itself.
            return null;
        }
        return null;
    },
});

export const scalarResolvers = {
    FlexibleString: flexibleStringScalar,
};
