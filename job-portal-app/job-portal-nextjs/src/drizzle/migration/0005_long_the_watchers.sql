CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`employer_id` int NOT NULL,
	`description` text NOT NULL,
	`tags` text,
	`min_salary` int,
	`max_salary` int,
	`salary_currency` enum('USD','EUR','GBP','CAD','AUD','JPY','INR','NPR','PKR','BDT'),
	`salary_period` enum('hourly','daily','weekly','monthly','yearly'),
	`location` varchar(255),
	`job_type` enum('remote','hybrid','on-site'),
	`work_type` enum('full-time','part-time','contract','temporary','freelance'),
	`job_level` enum('internship','entry level','junior','mid level','senior level','lead','manager','director','executive'),
	`experience` text,
	`min_education` enum('none','high school','undergraduate','masters','phd'),
	`is_featured` boolean NOT NULL DEFAULT false,
	`expired_at` date,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_employer_id_employers_id_fk` FOREIGN KEY (`employer_id`) REFERENCES `employers`(`id`) ON DELETE cascade ON UPDATE no action;