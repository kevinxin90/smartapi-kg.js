export default class FailToLoadSpecError extends Error {
    constructor(message = "Loading spec failed") {
        super();

        this.name = 'FailedToLoadSpecError';
        this.message = message;
    }
}
