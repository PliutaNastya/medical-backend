const { readData, writeData } = require('../utils/fileHandler')
const { v4: uuidv4 } = require('uuid')

const filePath = './data/patients.json'

exports.getAllPatients = async (req, res) => {
	const patients = await readData(filePath)
	const { name, page = 1, limit = 5 } = req.query
	let filteredPatients = patients

	if (name) {
		filteredPatients = filteredPatients.filter((p) =>
			p.fullName.toLowerCase().includes(name.toLowerCase())
		)
	}

	const pageNum = parseInt(page)
	const limitNum = parseInt(limit)
	const startIndex = (pageNum - 1) * limitNum
	const endIndex = startIndex + limitNum

	const paginatedPatients = filteredPatients.slice(startIndex, endIndex)

	const totalItems = filteredPatients.length
	const totalPages = Math.ceil(totalItems / limitNum)

	res.json({
		data: paginatedPatients,
		total: totalItems,
		totalPages,
		page: pageNum,
		limit: limitNum
	})
}

exports.getPatientById = async (req, res) => {
	const patients = await readData(filePath)
	const patient = patients.find((p) => p.id === req.params.id)
	if (patient) res.json(patient)
	else res.status(404).json({ error: 'Пацієнта не знайдено' })
}

exports.createPatient = async (req, res) => {
	const patients = await readData(filePath)
	const newPatient = { id: uuidv4(), ...req.body }
	patients.push(newPatient)
	await writeData(filePath, patients)
	res.status(201).json(newPatient)
}

exports.updatePatient = async (req, res) => {
	const patients = await readData(filePath)
	const index = patients.findIndex((p) => p.id === req.params.id)
	if (index !== -1) {
		patients[index] = { ...patients[index], ...req.body }
		await writeData(filePath, patients)
		res.json(patients[index])
	} else res.status(404).json({ error: 'Пацієнта не знайдено' })
}

exports.deletePatient = async (req, res) => {
	const patients = await readData(filePath)
	const updated = patients.filter((p) => p.id !== req.params.id)
	if (updated.length === patients.length)
		return res.status(404).json({ error: 'Пацієнта не знайдено' })
	await writeData(filePath, updated)
	res.status(204).end()
}
