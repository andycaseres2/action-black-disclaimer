const FlatironContent = () => {
	return (
		<div className="flex w-full flex-col">
			<div className="flex items-center pb-6">
				<img src="/logo_usa.png" alt="logo_usa" />
			</div>
			{/* Facility Info */}
			<div className="mb-4">
				<p className="text-gray-700">
					<strong>Facility:</strong> Action Black Flatiron Llc
				</p>
				<p className="text-gray-700">
					<strong>Location:</strong> 3W.26th ST
				</p>
			</div>

			{/* Waiver Intro */}
			<div className="mb-4">
				<p className="text-gray-700">
					I, the undersigned, wish to use the facilities and participate in activities provided by
					Action Black Flatiron Llc. By signing this waiver, I acknowledge and agree to the
					following terms:
				</p>
			</div>

			{/* Assumption of Risk */}
			<div className="mb-4">
				<p className="text-gray-700">
					<strong>Assumption of Risk:</strong> I acknowledge, understand, and assume sole
					responsibility for any accidents and incidents within the facilities. I acknowledge that
					using gym facilities, equipment, and participating in physical activity may cause injury,
					strain, discomfort, and the possibility of serious injury or death. I assume all risks and
					responsibility for any injuries or other medical incidents.
				</p>
			</div>

			{/* Waiver and Release */}
			<div className="mb-4">
				<p className="text-gray-700">
					<strong>Waiver and Release:</strong> I hereby release, waive, discharge, and agree not to
					sue the provider, its employees, representatives, affiliates, or agents from any claims,
					demands, liabilities, damages, expenses, and causes of action of any nature arising from
					my use of the gym facilities, whether caused by the negligence of the provider or
					otherwise.
				</p>
			</div>

			{/* Medical Representation */}
			<div className="mb-4">
				<p className="text-gray-700">
					<strong>Medical Representation:</strong> I represent that I am physically fit to use the
					gym facilities and participate in physical exercise. I have no medical condition that
					would prevent my safe participation. If I have any medical conditions or concerns, I have
					consulted with a healthcare provider and obtained clearance to participate.
				</p>
			</div>

			{/* Rules and Regulations */}
			<div className="mb-4">
				<p className="text-gray-700">
					<strong>Rules and Regulations:</strong> I accept the general regulations of Action Black
					services.
					<a href="https://example.com" className="text-indigo-600 underline">
						See regulations
					</a>
					. I agree to abide by all rules, regulations, and policies of the provider, including
					proper use of equipment, following safety guidelines, and respecting other members and
					staff.
				</p>
			</div>

			{/* Consent to Medical Treatment */}
			<div className="mb-4">
				<p className="text-gray-700">
					<strong>Consent to Medical Treatment:</strong> I hereby consent to receive any necessary
					medical treatment resulting from my use of the gym facilities and agree to bear all costs
					associated with such treatment.
				</p>
			</div>

			{/* Acknowledgment */}
			<div className="mb-4">
				<p className="text-gray-700">
					<strong>Acknowledgment:</strong> I have read this gym waiver and release agreement,
					understand its contents, and agree to be bound by its terms. I understand that I am giving
					up substantial legal rights by signing this document.
				</p>
			</div>

			{/* Data Consent */}
			<div className="mb-4">
				<p className="text-gray-700">
					I accept that my data may be used to send information by Action Black.
				</p>
			</div>
		</div>
	)
}

export default FlatironContent
