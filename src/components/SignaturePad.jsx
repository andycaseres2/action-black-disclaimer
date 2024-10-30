import React, { useRef, useState, useEffect } from 'react'
import Trash from '../Icons/Trash'

const SignaturePad = ({ setSignature }) => {
	const canvasRef = useRef(null)
	const [isDrawing, setIsDrawing] = useState(false)
	const [lastX, setLastX] = useState(0)
	const [lastY, setLastY] = useState(0)
	let inactivityTimeout = useRef(null)

	useEffect(() => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')
		context.strokeStyle = 'black'
		context.lineWidth = 1.5
		context.lineJoin = 'round'
		context.lineCap = 'round'
		context.fillStyle = 'white'
		context.fillRect(0, 0, canvas.width, canvas.height)

		canvas.style.touchAction = 'none'
	}, [])

	const getCursorPosition = (e) => {
		const canvas = canvasRef.current
		const rect = canvas.getBoundingClientRect()
		const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
		const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
		return { x, y }
	}

	const startDrawing = (e) => {
		clearTimeout(inactivityTimeout.current) // Limpiar cualquier temporizador previo
		setIsDrawing(true)
		ctx.beginPath()
		ctx.moveTo(x, y)
	}

	const draw = (e) => {
		if (!isDrawing) return

		const canvas = canvasRef.current
		const context = canvas.getContext('2d')

		context.beginPath()
		context.moveTo(lastX, lastY)
		context.lineTo(x, y)
		context.stroke()

		setLastX(x)
		setLastY(y)
	}

	const stopDrawing = () => {
		const ctx = ctxRef.current
		ctx.closePath()
		setIsDrawing(false)

		// Iniciar temporizador de inactividad para guardar la firma después de 2 segundos
		inactivityTimeout.current = setTimeout(() => {
			const canvas = canvasRef.current
			canvas.toBlob((blob) => {
				if (blob && setSignature) {
					setSignature(blob)
				}
			}, 'image/png')
		}, 2000) // Espera 2 segundos para confirmar que el usuario ha dejado de firmar
	}

	const clearCanvas = () => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')
		context.clearRect(0, 0, canvas.width, canvas.height)
		context.fillStyle = 'white'
		context.fillRect(0, 0, canvas.width, canvas.height)
		clearTimeout(inactivityTimeout.current) // Limpiar el temporizador al limpiar el canvas
	}

	return (
		<div style={{ textAlign: 'center' }}>
			<canvas
				ref={canvasRef}
				width={500}
				height={300}
				className="rounded-lg border border-gray-300"
				onMouseDown={startDrawing}
				onMouseMove={draw}
				onMouseUp={stopDrawing}
				onMouseLeave={stopDrawing}
				onTouchStart={startDrawing}
				onTouchMove={draw}
				onTouchEnd={stopDrawing}
			/>
			<br />
			<div className="flex w-full justify-end">
				<button className="rounded-md bg-red-500 p-2 hover:scale-105" onClick={clearCanvas}>
					<Trash color={'white'} />
				</button>
			</div>
		</div>
	)
}

export default SignaturePad
