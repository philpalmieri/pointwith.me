const fibonacci = (input) => {
    let sequence = [0, 1];
    let i = 2;

    while (i <= input) {
        sequence[i] = sequence[i - 1] + sequence[i - 2];
        i++;
    }

    return sequence;

};

export default fibonacci;