import {Readable} from 'node:stream';

class OneToHundredStream extends Readable {
	constructor() {
		super();
		this.current = 0;
	}

	_read() {
		this.current++;
		if (this.current > 100) {
			this.push(null);
		} else {
			this.push(`${this.current}\n`);
		}
	}
}

new OneToHundredStream()
	.pipe(process.stdout);