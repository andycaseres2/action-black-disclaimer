import React, { useRef, useState, useEffect } from 'react'
import Trash from '../Icons/Trash'

const SignaturePad = () => {
	const canvasRef = useRef(null)
	const [isDrawing, setIsDrawing] = useState(false)
	const ctxRef = useRef(null)

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')

		// Ajusta la resolución del canvas
		const scale = window.devicePixelRatio
		canvas.width = 400 * scale // Ajusta el ancho según la escala
		canvas.height = 300 * scale // Ajusta la altura según la escala
		ctx.scale(scale, scale) // Escalar el contexto

		ctxRef.current = ctx
		ctx.lineWidth = 2 // Grosor de la línea
		ctx.strokeStyle = '#000' // Color de la línea
		ctx.lineCap = 'round' // Estilo de la punta de la línea
	}, [])

	const getCursorPosition = (e) => {
		const canvas = canvasRef.current
		const rect = canvas.getBoundingClientRect()
		const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
		const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
		return { x, y }
	}

	const startDrawing = (e) => {
		const ctx = ctxRef.current
		const { x, y } = getCursorPosition(e)
		setIsDrawing(true)
		ctx.beginPath()
		ctx.moveTo(x, y)
	}

	const draw = (e) => {
		if (!isDrawing) return

		const ctx = ctxRef.current
		const { x, y } = getCursorPosition(e)
		ctx.lineTo(x, y)
		ctx.stroke()
	}

	const stopDrawing = () => {
		const ctx = ctxRef.current
		ctx.closePath()
		setIsDrawing(false)
	}

	const clearCanvas = () => {
		const canvas = canvasRef.current
		const ctx = ctxRef.current
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	}

	return (
		<div style={{ textAlign: 'center' }}>
			<canvas
				ref={canvasRef}
				style={{
					border: '1px solid #000',
					touchAction: 'none',
					borderRadius: '5px',
					width: '400px', // Tamaño visible
					height: '300px' // Tamaño visible
				}}
				onTouchStart={startDrawing}
				onTouchMove={draw}
				onTouchEnd={stopDrawing}
				onMouseDown={startDrawing}
				onMouseMove={draw}
				onMouseUp={stopDrawing}
				onMouseOut={stopDrawing}
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
