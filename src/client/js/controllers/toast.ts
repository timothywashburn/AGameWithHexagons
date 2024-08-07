function showToast(message: string, color: string) {
	let toast = document.getElementById('toast')!;

	toast.innerHTML = message;
	toast.style.backgroundColor = color;

	toast.className = 'toast show';

	setTimeout(function () {
		toast.style.animation = 'slideOutUp 0.5s forwards';
		setTimeout(function () {
			toast.className = 'toast';
			toast.style.animation = '';
		}, 500);
	}, 5000);
}

export { showToast };
