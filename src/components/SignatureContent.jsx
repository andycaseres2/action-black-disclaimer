import SignaturePad from './SignaturePad'

const SignatureContent = ({ resetSignature, setSignature, setResetSignature }) => {
	return (
		<div className="flex w-full flex-col gap-2 py-2">
			{/* Signature */}
			<div className="mb-4 flex flex-col items-start gap-4">
				<label className="mr-2 block font-medium text-gray-700">
					By affixing my signature hereto, I attest that I have thoroughly reviewed and
					comprehended:
				</label>
				<SignaturePad
					resetSignature={resetSignature}
					setSignature={setSignature}
					setResetSignature={setResetSignature}
				/>
			</div>
		</div>
	)
}

export default SignatureContent
