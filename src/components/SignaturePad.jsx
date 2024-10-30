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

		canvas.style.touchAction = 'none' // Evita el desplazamiento en dispositivos táctiles
	}, [])

	const getCanvasPosition = (e) => {
		const canvas = canvasRef.current
		const rect = canvas.getBoundingClientRect()
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		}
	}

	const startDrawing = (e) => {
		e.preventDefault()
		document.activeElement.blur() // Desenfoca cualquier input activo
		setIsDrawing(true)
		const { x, y } = getCanvasPosition(e)
		setLastX(x)
		setLastY(y)
	}

	const draw = (e) => {
		e.preventDefault()
		if (!isDrawing) return
		const { x, y } = getCanvasPosition(e)

		const canvas = canvasRef.current
		const context = canvas.getContext('2d')

		context.beginPath()
		context.moveTo(lastX, lastY)
		context.lineTo(x, y)
		context.stroke()

		setLastX(x)
		setLastY(y)
	}

	const stopDrawing = (e) => {
		e.preventDefault()
		setIsDrawing(false)

		// Inicia temporizador para guardar la firma después de 2 segundos de inactividad
		inactivityTimeout.current = setTimeout(() => {
			const canvas = canvasRef.current
			canvas.toBlob((blob) => {
				if (blob && setSignature) {
					setSignature(blob)
				}
			}, 'image/png')
		}, 2000) // Espera 2 segundos para confirmar que el usuario ha dejado de firmar
	}

	const clearSignature = () => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')
		context.clearRect(0, 0, canvas.width, canvas.height)
		context.fillStyle = 'white'
		context.fillRect(0, 0, canvas.width, canvas.height)
		clearTimeout(inactivityTimeout.current)
	}

	return (
		<div>
			<canvas
				ref={canvasRef}
				width={500}
				height={300}
				className="rounded-lg border border-gray-300"
				onPointerDown={startDrawing}
				onPointerMove={draw}
				onPointerUp={stopDrawing}
				onPointerLeave={stopDrawing}
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
