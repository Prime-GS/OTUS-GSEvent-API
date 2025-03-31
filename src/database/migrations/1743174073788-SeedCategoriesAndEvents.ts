import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCategoriesAndEvents1743174073788
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert Categories
    await queryRunner.query(`
      INSERT INTO "categories" (title, description, color) VALUES
      ('Технологии', 'Всё о технологиях', '#FF0000'),
      ('Здоровье', 'Советы по здоровью и благополучию', '#00FF00'),
      ('Образование', 'Образовательные мероприятия и советы', '#0000FF'),
      ('Финансы', 'Финансы и инвестиции', '#FFFF00'),
      ('Спорт', 'Спортивные мероприятия и новости', '#FFA500'),
      ('Музыка', 'Концерты и музыкальные фестивали', '#800080'),
      ('Искусство', 'Выставки и события искусства', '#FFC0CB'),
      ('Игры', 'Игровые турниры и новости', '#00FFFF'),
      ('Путешествия', 'Советы и впечатления о путешествиях', '#008080'),
      ('Еда', 'Фестивали еды и кулинарные советы', '#A52A2A');
    `);

    // Insert Events
    await queryRunner.query(`
      INSERT INTO "events" (title, slug, description, "started_at", "creator_id") VALUES
      ('Техноконференция 2025', 'tech-conference-2025', 'Ежегодная техноконференция с топовыми спикерами.', '2025-03-01 10:30', 1),
      ('Ярмарка здоровья и благополучия', 'health-wellness-fair', 'Откройте лучшие практики благополучия.', '2025-04-15 14:45', 1),
      ('Образовательный саммит', 'education-summit', 'Улучшение образования по всему миру.', '2025-05-20 09:15', 1),
      ('Финансовый форум', 'finance-forum', 'Последние тренды в финансах.', '2025-06-10 11:00', 1),
      ('Финал Лиги чемпионов', 'champions-league-finals', 'Главное футбольное событие года.', '2025-07-30 20:00', 1),
      ('Летний музыкальный фестиваль', 'summer-music-fest', 'Крупнейший музыкальный фестиваль этим летом.', '2025-08-18 18:30', 1),
      ('Выставка современного искусства', 'modern-art-exhibition', 'Исследуйте современное искусство.', '2025-09-12 16:45', 1),
      ('Чемпионат по киберспорту', 'e-sports-championship', 'Соревнование топовых команд.', '2025-10-05 13:20', 1),
      ('Мировая туристическая выставка', 'world-travel-expo', 'Откройте для себя мировые направления путешествий.', '2025-11-15 08:50', 1),
      ('Фестиваль гурманов', 'gourmet-food-festival', 'Оцените кулинарное мастерство.', '2025-12-20 19:10', 1);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "events";');
    await queryRunner.query('DELETE FROM "categories";');
  }
}
