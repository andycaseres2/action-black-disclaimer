import React, { useRef, useState, useEffect } from 'react'
import Trash from '../Icons/Trash'

const SignaturePad = ({ setSignature, reset, setReset }) => {
	const canvasRef = useRef(null)
	const [isDrawing, setIsDrawing] = useState(false)
	const [context, setContext] = useState(null)

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		ctx.strokeStyle = 'black'
		ctx.lineWidth = 2
		ctx.lineJoin = 'round'
		ctx.lineCap = 'round'
		ctx.fillStyle = 'white'
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		setContext(ctx)

		canvas.style.touchAction = 'none' // Prevents scrolling on touch devices
	}, [])

	const getCanvasPosition = (e) => {
		const canvas = canvasRef.current
		const rect = canvas.getBoundingClientRect()
		return {
			x: (e.clientX || (e.touches ? e.touches[0].clientX : 0)) - rect.left,
			y: (e.clientY || (e.touches ? e.touches[0].clientY : 0)) - rect.top
		}
	}

	const startDrawing = (e) => {
		e.preventDefault()
		setIsDrawing(true)
		const { x, y } = getCanvasPosition(e)
		context.beginPath()
		context.moveTo(x, y)
	}

	const draw = (e) => {
		if (!isDrawing) return
		e.preventDefault()
		const { x, y } = getCanvasPosition(e)
		context.lineTo(x, y)
		context.stroke()
	}

	const stopDrawing = () => {
		if (!isDrawing) return
		setIsDrawing(false)
		if (setSignature) {
			canvasRef.current.toBlob((blob) => setSignature(blob), 'image/png')
		}
	}

	const clearSignature = () => {
		if (context) {
			context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
			context.fillStyle = 'white'
			context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
		}
	}

	useEffect(() => {
		if (reset) {
			clearSignature()
			setReset(false)
		}
	}, [reset, setReset])

	return (
		<div>
			<canvas
				ref={canvasRef}
				width={500}
				height={300}
				className="rounded-lg border border-gray-300"
				onMouseDown={startDrawing} // Use mouse events for desktop
				onMouseMove={draw}
				onMouseUp={stopDrawing}
				onMouseLeave={stopDrawing}
				onTouchStart={startDrawing} // Touch events for mobile
				onTouchMove={draw}
				onTouchEnd={stopDrawing}
			/>
			<div className="mt-4 flex w-full justify-end space-x-2">
				<button onClick={clearSignature} className="rounded bg-red-500 p-2 text-white">
					<Trash />
				</button>
			</div>
		</div>
	)
}

export default SignaturePad
