import { Router } from "express";
import * as appealController from "../controllers/appealController";
import { asyncHandler } from "../utils/asyncHandler";
import { validateDTO } from "../middlewares/validation.middleware";
import { CreateAppealDto } from "../dto/create-appeal.dto";
import { UpdateAppealDto } from "../dto/update-appeal.dto";
import { cancelAllInProgressDto } from "../dto/cancel-all-in-progress.dto";
import { validateAppealsQuery } from "../middlewares/validateAppealsQuery.middleware";
import { CompleteAppealDto } from "../dto/complete-appeal.dto";
const router = Router();


/**
 * @swagger
 * /api/appeals:
 *   post:
 *     summary: Создать новое обращение
 *     tags: [Appeals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - theme
 *               - text
 *             properties:
 *               theme:
 *                 type: string
 *                 example: "Проблема с доступом"
 *               text:
 *                 type: string
 *                 example: "Не могу войти в систему"
 *     responses:
 *       201:
 *         description: Обращение успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appeal'
 *       400:
 *         description: Неверные входные данные
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post("/",validateDTO(CreateAppealDto), asyncHandler(appealController.createAppeal));



/**
 * @swagger
 * /api/appeals/{id}/start:
 *   put:
 *     summary: Взять обращение в работу
 *     tags: [Appeals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID обращения
 *     responses:
 *       200:
 *         description: Статус обращения изменен на "in_progress"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appeal'
 *       400:
 *         description: Невозможно взять в работу (неверный статус)
 *       404:
 *         description: Обращение не найдено
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put("/:id/start", asyncHandler<{},{id:string}>(appealController.startAppeal));





/**
 * @swagger
 * /api/appeals/{id}/complete:
 *   put:
 *     summary: Завершить обращение
 *     tags: [Appeals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID обращения
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resolution
 *             properties:
 *               resolution:
 *                 type: string
 *                 example: "Проблема решена"
 *     responses:
 *       200:
 *         description: Обращение успешно завершено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appeal'
 *       400:
 *         description: Обращение не в статусе 'in_progress' или не указано решение
 *       404:
 *         description: Обращение не найдено
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put("/:id/complete", validateDTO(CompleteAppealDto), asyncHandler<CompleteAppealDto,{id:string}>(appealController.completeAppeal));




/**
 * @swagger
 * /api/appeals/{id}/cancel:
 *   put:
 *     summary: Отменить обращение
 *     tags: [Appeals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID обращения
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cancellationReason
 *             properties:
 *               cancellationReason:
 *                 type: string
 *                 example: "Дубликат обращения"
 *     responses:
 *       200:
 *         description: Обращение успешно отменено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appeal'
 *       400:
 *         description: Обращение уже завершено или не указана причина отмены
 *       404:
 *         description: Обращение не найдено
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put("/:id/cancel", validateDTO(cancelAllInProgressDto), asyncHandler<UpdateAppealDto,{id:string}>(appealController.cancelAppeal));





/**
 * @swagger
 * /api/appeals:
 *   get:
 *     summary: Получить список обращений
 *     tags: [Appeals]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Фильтр по конкретной дате (YYYY-MM-DD)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Начальная дата диапазона
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Конечная дата диапазона
 *     responses:
 *       200:
 *         description: Список обращений
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appeal'
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get("/",validateAppealsQuery, asyncHandler<{},{date:string, startDate:string, endDate:string}>(appealController.getAppeals));





/**
 * @swagger
 * /api/appeals/cancel-all-in-progress:
 *   post:
 *     summary: Отменить все обращения в статусе "В работе"
 *     tags: [Appeals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cancellationReason
 *             properties:
 *               cancellationReason:
 *                 type: string
 *                 example: "Системная ошибка"
 *     responses:
 *       200:
 *         description: Результат массовой отмены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *       400:
 *         description: Не указана причина отмены
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post("/cancel-all-in-progress", asyncHandler<cancelAllInProgressDto,{}>(appealController.cancelAllInProgress));

export default router;