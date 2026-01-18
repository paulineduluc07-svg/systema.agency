CREATE TABLE `canvas_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tabId` varchar(64) NOT NULL,
	`data` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `canvas_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `custom_tabs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tabId` varchar(64) NOT NULL,
	`label` varchar(128) NOT NULL,
	`color` varchar(32) NOT NULL DEFAULT '#FF69B4',
	`icon` varchar(64) NOT NULL DEFAULT 'file',
	`tabType` enum('widgets','whiteboard') NOT NULL DEFAULT 'whiteboard',
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `custom_tabs_id` PRIMARY KEY(`id`)
);
