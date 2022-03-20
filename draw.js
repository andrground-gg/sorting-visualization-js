const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
let array = [];
let arraySize = 50;
let elemWidth = canvas.width / arraySize;
let elemX = 0;
let i = 0;
let j = 0;
let sort;
let draw;
let endSort = false;
let states = [];

function setup(){
	for(let i = 0; i < arraySize; i++){
		states[i] = -1;
		array[i] = Math.floor(Math.random() * canvas.height) + 5;		
	}
	
	draw = window.setInterval(()=>{			
		ctx.clearRect(0,0,canvas.width,canvas.height);
		elemX = 0;
		for(ind in array){
			if(states[ind] == 0)
				ctx.fillStyle = 'red';
			else if(states[ind] == 1)
				ctx.fillStyle = 'green';
			else
				ctx.fillStyle = 'black';
			ctx.fillRect(elemX, canvas.height, elemWidth, array[ind] * -1);
			elemX += elemWidth;
		}
	}, 1);
}
setup();
function sleep(ms){	
	if(endSort)
		return;
	return new Promise(resolve => sort = setTimeout(resolve, ms));			
}
document.querySelector('#bubble').addEventListener('click',()=>{
	document.querySelector('#bubble').disabled = true;
	document.querySelector('#selection').disabled = true;
	document.querySelector('#quick').disabled = true;
	document.querySelector('#merge').disabled = true;
	document.querySelector('#radix').disabled = true;
	document.querySelector('#size').disabled = true;
	
	sort = window.setInterval(()=>{
		states[j] = -1;
		if(array[j] > array[j+1]){
			let temp = array[j];
			array[j] = array[j + 1];
			array[j + 1] = temp;
		}
		j++;
		states[j] = 0;
		if(j >= array.length - 1 - i){
			i++;
			states[j] = -1;
			j = 0;
		}	
		if(i >= array.length - 1){
			clearInterval(sort);
			i = 0;
			j = 0;
		}
	}, 1);	
});
document.querySelector('#selection').addEventListener('click',()=>{
	document.querySelector('#bubble').disabled = true;
	document.querySelector('#selection').disabled = true;
	document.querySelector('#quick').disabled = true;
	document.querySelector('#merge').disabled = true;
	document.querySelector('#radix').disabled = true;
	document.querySelector('#size').disabled = true;
	
	min = array[i];
	min_ind = i;
	j = i + 1;
	sort = window.setInterval(()=>{
		states[j] = -1;		
		if(array[j] < min){
			min = array[j];
			min_ind = j;
		}
		j++;
		states[j] = 0;
		if(j >= array.length){				
			array[min_ind] = array[i];
			array[i] = min;
			
			i++;
			j = i + 1;
			
			min = array[i];
			min_ind = i;
		}
		if(i >= array.length - 1){
			clearInterval(sort);
			i = 0;
			j = 0;
		}	
	}, 1);	
});
document.querySelector('#quick').addEventListener('click',()=>{
	document.querySelector('#bubble').disabled = true;
	document.querySelector('#selection').disabled = true;
	document.querySelector('#quick').disabled = true;
	document.querySelector('#merge').disabled = true;
	document.querySelector('#radix').disabled = true;
	document.querySelector('#size').disabled = true;
	endSort = false;
		
	async function quickSort(arr, start, end){		
		if(start >= end)
			return;
		let index = await partition(arr,start,end);
		states[index] = -1;
		
		await Promise.all([quickSort(arr,start,index - 1), await quickSort(arr, index + 1, end)]);	
	}
	
	async function partition(arr,start,end){
		for(let ind = start; ind <= end; ind++){
			states[ind] = 1;			
		}
		let pivotIndex = start;
		let pivotValue = arr[end];
		states[pivotIndex] = 0;
		for(let i = start; i < end; i++){
			if(arr[i] < pivotValue){
				await sleep(1);
				
				temp = arr[i];
				arr[i] = arr[pivotIndex];
				arr[pivotIndex] = temp;
				
				states[pivotIndex] = -1;
				pivotIndex++;
				states[pivotIndex] = 0;
			}
		}
		temp = arr[pivotIndex];
		arr[pivotIndex] = arr[end];
		arr[end] = temp;
		
		for(let ind = start; ind <= end; ind++){
			if(ind != pivotIndex)
				states[ind] = -1;			
		}
		return pivotIndex;
	}
	
	quickSort(array, 0, array.length - 1);
});
document.querySelector('#merge').addEventListener('click',()=>{
	document.querySelector('#bubble').disabled = true;
	document.querySelector('#selection').disabled = true;
	document.querySelector('#quick').disabled = true;
	document.querySelector('#merge').disabled = true;
	document.querySelector('#radix').disabled = true;
	document.querySelector('#size').disabled = true;
	endSort = false;			
	
	async function mergeSort(arr, l, r){
		if(l < r){			
			let m = parseInt((l + r) / 2);
			
			await mergeSort(arr, l, m);			
			await mergeSort(arr, m + 1, r);
			
			await merge(arr, l, m, r);
		}
		return;
	}
	async function merge(arr, l, m, r){
		states[r] = 1;

		let n1 = m - l + 1;
		let n2 = r - m;
		
		let lArr = [], rArr = [];
		
		for(let i = 0; i < n1; i++)
			lArr[i] = arr[l + i];		
		for(let j = 0; j < n2; j++)
			rArr[j] = arr[m + 1 + j];
		let i = 0;
		let j = 0;
		let k = l;
		while(i < n1 && j < n2){
			states[k] = 0;
			await sleep(1);			
			if(lArr[i] <= rArr[j]){			
				arr[k] = lArr[i];
				i++;
			}
			else{
				arr[k] = rArr[j];
				j++;
			}
			
			states[k] = -1;
			k++;			
		}
		while(i < n1){
			arr[k] = lArr[i];
			i++;
			k++;
		}
		while(j < n2){
			arr[k] = rArr[j];
			j++;
			k++;
		}

		states[r] = -1;
	}	
	mergeSort(array, 0, array.length - 1);	
});	
document.querySelector('#radix').addEventListener('click',()=>{
	document.querySelector('#bubble').disabled = true;
	document.querySelector('#selection').disabled = true;
	document.querySelector('#quick').disabled = true;
	document.querySelector('#merge').disabled = true;
	document.querySelector('#radix').disabled = true;
	document.querySelector('#size').disabled = true;
	endSort = false;
	
	async function getMax(arr, n){
		let mx = arr[0];
		for(let i = 1; i < n; i++){
			if(arr[i] > mx)
				mx = arr[i];
		}
		return mx;	
	}
	
	async function countSort(arr, n, exp){
		let output = new Array(n).fill(0);
		let count = new Array(10).fill(0);
		
		for(let i = 0; i < n; i++){
			count[parseInt(arr[i] / exp) % 10]++;
		}
		
		for(let i = 1; i < 10; i++){
			count[i] += count[i-1];
		}	
		 
		for(let i = n - 1; i >= 0; i--){
			output[count[parseInt(arr[i] / exp) % 10] - 1] = arr[i];
			count[parseInt(arr[i] / exp) % 10]--;
		}
		
		for(let i = 0; i < n; i++){
			states[i] = 0;
			await sleep(1);
			arr[i] = output[i];
			states[i] = -1;
		}	
		
	}
	
	async function radixSort(arr, n){		
		let m = await getMax(arr, n);
		
		for(let exp = 1; parseInt(m / exp) > 0; exp *= 10){	
			await countSort(arr, n, exp);	
		}	
	}
	
	radixSort(array, array.length);
});	
document.querySelector('#reset').addEventListener('click',()=>{
	clearTimeout(sort);
	endSort = true;
	document.querySelector('#bubble').disabled = false;
	document.querySelector('#selection').disabled = false;
	document.querySelector('#merge').disabled = false;
	document.querySelector('#quick').disabled = false;
	document.querySelector('#radix').disabled = false;
	document.querySelector('#size').disabled = false;
	i = 0;
	j = 0;
	setTimeout(function(){
		setup();
	}, 10);
});
document.querySelector('#size').addEventListener('input', ()=> {
	console.log(states.length);
	arraySize = document.querySelector('#size').value;
	elemWidth = canvas.width / arraySize;
	array = array.splice(0, arraySize);
	states = [];
	clearInterval(draw);
	document.querySelector("#sizeVal").innerHTML = arraySize;
	setup();	
});