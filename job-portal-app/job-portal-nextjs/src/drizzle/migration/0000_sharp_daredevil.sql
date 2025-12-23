CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`user_name` varchar(255),
	`password` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone_number` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_user_name_unique` UNIQUE(`user_name`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
