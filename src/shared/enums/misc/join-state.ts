import CustomEnum, { EnumValue } from '../custom-enum';

export class JoinStateEnum extends CustomEnum<JoinState> {
	constructor() {
		super();
	}

	public HOST = this.addValue(new JoinState());
	public JOINED = this.addValue(new JoinState());
	public NOT_JOINED = this.addValue(new JoinState());
}

export class JoinState extends EnumValue {
	constructor() {
		super();
	}
}
