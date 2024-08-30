export default abstract class CustomEnum<T extends EnumValue> {
	public readonly enumValues: T[] = [];

	protected constructor() {}

	public getFromIndex(index: number) {
		return this.enumValues[index];
	}

	public addValue(enumValue: T) {
		enumValue.setIndex(this.enumValues.length);
		this.enumValues.push(enumValue);
		return enumValue;
	}
}

export abstract class EnumValue {
	private index: number;

	protected constructor() {}

	public getIndex() {
		return this.index;
	}

	public setIndex(index: number) {
		this.index = index;
	}
}
