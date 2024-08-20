export type TurnTypeData = {
	text: string;
};

export const TurnType: Readonly<{ [key: string]: TurnTypeData }> = Object.freeze({
	DEVELOP: { text: 'Develop' },
	SIEGE: { text: 'Siege' },
});
