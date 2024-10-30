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
		const scale = window.devicePixelRatio || 1 // Escala del dispositivo
		canvas.width = 500 * scale // Ajusta el ancho según la escala
		canvas.height = 300 * scale // Ajusta la altura según la escala
		ctx.scale(scale, scale) // Escalar el contexto

		ctxRef.current = ctx
		ctx.lineWidth = 2 // Grosor de la línea
		ctx.strokeStyle = '#000' // Color negro para la línea
		ctx.lineCap = 'round' // Estilo de la punta de la línea
	}, [])

	const startDrawing = (e) => {
		const canvas = canvasRef.current
		const ctx = ctxRef.current

		setIsDrawing(true)
		ctx.beginPath()

		const rect = canvas.getBoundingClientRect()
		const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
		const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top

		ctx.moveTo(x, y)
	}

	const draw = (e) => {
		if (!isDrawing) return

		const canvas = canvasRef.current
		const ctx = ctxRef.current

		const rect = canvas.getBoundingClientRect()
		const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
		const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top

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
					width: '500px', // Tamaño visible
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
				<button onClick={clearCanvas}>
					<Trash />
				</button>
			</div>
		</div>
	)
}

export default SignaturePad
