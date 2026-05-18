CREATE TABLE `resumes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicant_id` int NOT NULL,
	`file_url` text NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`file_size` int,
	`is_primary` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resumes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `resumes` ADD CONSTRAINT `resumes_applicant_id_applicants_id_fk` FOREIGN KEY (`applicant_id`) REFERENCES `applicants`(`id`) ON DELETE cascade ON UPDATE no action;