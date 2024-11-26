export const getArgs = value => {
    const args = value.split('|');
    args.splice(0, 1);
    return args;
};
