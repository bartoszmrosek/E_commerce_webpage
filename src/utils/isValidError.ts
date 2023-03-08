export const isValidError = (arg: unknown): arg is Error => {
    return arg instanceof Error;
};
