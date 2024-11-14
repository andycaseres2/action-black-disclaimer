import { useEffect, useState } from 'react'
import CheckIcon from './CheckIcon'
import ErrorIcon from './ErrorIcon'

type Props = {
	onClose: () => void
	handleSubmit: () => void
	resetForm: () => void
	message?: {
		text: string
		type: 'success' | 'error'
	}
}

const LoadingModalSecondary = ({ onClose, handleSubmit, resetForm, message }: Props) => {
	const [isFinished, setIsFinished] = useState(false)

	useEffect(() => {
		const handleSubmitForm = async () => {
			await handleSubmit()
			await setIsFinished(true)
		}
		handleSubmitForm()
	}, [])

	const handleFinished = () => {
		resetForm()
		onClose()
		setIsFinished(false)
	}

	useEffect(() => {
		if (isFinished) {
			setTimeout(() => {
				if (message?.type !== 'error') {
					window.location.href = 'https://www.actionblack.us/memberships'
				} else {
					handleFinished()
				}
			}, 5000)
		}
	}, [isFinished])

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg">
				{!isFinished && <p className="text-2xl font-semibold">Loading</p>}
				<div className="flex flex-col items-center justify-center gap-4">
					{/* Aquí puedes agregar un spinner si lo deseas */}
					{!isFinished && (
						<div className="mt-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
					)}
					{message?.type === 'success' && <CheckIcon />}
					{message?.type === 'error' && <ErrorIcon />}
					{message && <p className="text-lg">{message.text}</p>}
				</div>
			</div>
		</div>
	)
}

export default LoadingModalSecondary
