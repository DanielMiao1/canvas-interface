export type workflow_state = (
	"unpublished" | "available" | "completed" | "deleted"
);

export type view_type = (
	"feed" | "wiki" | "modules" | "assignments" | "syllabus"
);

export type grading_type = (
	"pass_fail" | "percent" | "letter_grade" | "gpa_scale" | "points"
);

export type assignment_submission_type = (
	"discussion_topic" | "online_quiz" | "on_paper" | "none" | "external_tool" |
	"online_text_entry" | "online_url" | "online_upload" | "media_recording" |
	"student_annotation" | "not_graded"
);

export type online_submission_type = (
	"online_text_entry" | "online_url" | "online_upload" | "online_quiz" |
	"media_recording" | "student_annotation"
);

export type late_policy_status = "late" | "missing" | "extended" | "none";
 
export type enrollment_type = (
	"StudentEnrollment" | "TeacherEnrollment" | "TaEnrollment" |
	"DesignerEnrollment" | "ObserverEnrollment"
);

export interface Term {
	id: number;
	name: string;
	start_at: string;
	end_at: string | null;
}

export interface CourseProgress {
	requirement_count: number;
	requirement_completed_count: number;
	next_requirement_url: string;
	completed_at: string;
}

export interface Course {
	id: number;
	sis_course_id?: string;
	uuid: string;
	integration_id?: string;
	sis_import_id?: number;
	name: string;
	course_code: string;
	original_name?: string;
	workflow_state: workflow_state;
	account_id: number;
	root_account_id: number;
	enrollment_term_id: number;
	grading_periods: any;
	grading_standard_id: number;
	grade_passback_setting: string;
	created_at: string;
	start_at: string;
	end_at: string;
	locale: string;
	enrollments?: Enrollment[] | null;
	total_students?: number;
	calendar: any;
	default_view: view_type;
	syllabus_body?: string;
	needs_grading_count?: number;
	term?: Term;
	course_progress?: CourseProgress;
	apply_assignment_group_weights: boolean;
	permissions?: Record<string, boolean>;
	is_public: boolean;
	is_public_to_auth_users: boolean;
	public_syllabus: boolean;
	public_syllabus_to_auth: boolean;
	public_description?: string;
	storage_quota_mb: number;
	storage_quota_used_mb: number;
	hide_final_grades: boolean;
	license: string;
	allow_student_assignment_edits: boolean;
	allow_wiki_comments: boolean;
	allow_student_forum_attachments: boolean;
	open_enrollment: boolean;
	self_enrollment: boolean;
	restrict_enrollments_to_course_dates: boolean;
	course_format: string;
	access_restricted_by_date?: boolean;
	time_zone: string;
	blueprint?: boolean;
	blueprint_restrictions?: Record<string, boolean>;
	blueprint_restrictions_by_object_type?: any;
	template?: boolean;
}

interface SectionNeedsGradingCount {
	section_id: number;
	needs_grading_count: number;
}

export interface BaseUser {
	created_at?: string;
	id: number;
	login_id?: string;
	name: string;
	sortable_name: string;
	short_name: string;
}

export interface EnrollmentGrades {
	current_grade: number | null;
	current_score: number | null;
	final_grade: number | null;
	final_score: number | null;
	html_url: string;
}

export interface Enrollment {
	id: number;
	course_id: number;
	sis_course_id?: string;
	course_integration_id?: string;
	course_section_id: number;
	section_integration_id?: string;
	sis_account_id?: string;
	sis_section_id?: string;
	sis_user_id?: string;
	enrollment_state: string;
	limit_privileges_to_course_section: boolean;
	sis_import_id?: number;
	root_account_id: number;
	type: enrollment_type;
	user_id: number;
	associated_user_id: null | number;
	role: enrollment_type;
	role_id: number;
	created_at: string;
	updated_at: string;
	started_at: string;
	end_at: string;
	last_activity_at: string;
	last_attended_at: string;
	total_activity_time: number;
	html_url: string;
	grades: EnrollmentGrades;
	user: BaseUser;
	override_grade: string;
	override_score: number;
	unposted_current_grade?: any;
	unposted_final_grade?: any;
	unposted_current_score?: any;
	unposted_final_score?: any;
	has_grading_periods?: boolean;
	totals_for_all_grading_periods_option?: boolean;
	current_grading_period_title?: string;
	current_grading_period_id?: number;
	current_period_override_grade: string;
	current_period_override_score: number;
	current_period_unposted_current_score?: number;
	current_period_unposted_final_score?: number;
	current_period_unposted_current_grade?: string;
	current_period_unposted_final_grade?: string;
}

export interface User extends BaseUser {
	last_name: string;
	first_name: string;
	sis_user_id?: string;
	sis_import_id?: number;
	integration_id?: string;
	login_id: string;
	avatar_url?: string;
	avatar_state?: string;
	enrollments: Enrollment[];
	email?: string;
	locale?: string;
	last_login?: string;
	time_zone?: string;
	bio?: string;
	pronouns?: string;
}

export interface Submission {
	assignment_id: number;
	assignment?: Assignment;
	course?: Course;
	attempt: number;
	body: string;
	grade: string;
	grade_matches_current_submission: boolean;
	html_url: string;
	preview_url: string;
	score: number;
	submission_comments?: any;
	submission_type: online_submission_type;
	submitted_at: string;
	url: null | string;
	user_id: number;
	grader_id: null | number;
	graded_at: string;
	user?: User;
	late: boolean;
	assignment_visible: boolean;
	excused: boolean;
	missing: boolean;
	late_policy_status: late_policy_status | null;
	points_deducted: number;
	seconds_late: number;
	workflow_state: workflow_state;
	extra_attempts: number;
	anonymous_id?: string;
	posted_at: string | null;
	read_status?: string;
	redo_request: boolean;
}

export interface Assignment {
	id: number;
	name: string;
	description?: string;
	created_at: string;
	updated_at: string;
	due_at: string;
	lock_at: string;
	unlock_at: string;
	has_overrides: boolean;
	all_dates?: unknown;
	course_id: number;
	html_url: string;
	submissions_download_url: string;
	assignment_group_id: number;
	due_date_required: boolean;
	allowed_extensions: string[];
	max_name_length: number;
	turnitin_enabled?: boolean;
	vericite_enabled?: boolean;
	turnitin_settings?: any;
	grade_group_students_individually: boolean;
	external_tool_tag_attributes?: any;
	peer_reviews: boolean;
	automatic_peer_reviews: boolean;
	peer_review_count?: number;
	peer_reviews_assign_at?: string;
	intra_group_peer_reviews: boolean;
	group_category_id: number;
	needs_grading_count?: number;
	needs_grading_count_by_section?: SectionNeedsGradingCount[];
	position: number;
	post_to_sis?: boolean;
	integration_id?: any;
	integration_data?: any;
	points_possible: number;
	submission_types: assignment_submission_type[];
	has_submitted_submissions: boolean;
	grading_type: grading_type;
	grading_standard_id?: any;
	published: boolean;
	unpublishable: boolean;
	only_visible_to_overrides: boolean;
	locked_for_user: boolean;
	lock_info?: any;
	lock_explanation?: string;
	quiz_id?: number;
	anonymous_submissions?: boolean;
	discussion_topic?: any;
	freeze_on_copy?: boolean;
	frozen?: boolean;
	frozen_attributes?: string[];
	submission?: Submission;
	use_rubric_for_grading?: boolean;
	rubric_settings?: any;
	rubric?: any;
	assignment_visibility?: number[];
	overrides?: any;
	omit_from_final_grade?: boolean;
	hide_in_gradebook?: boolean;
	moderated_grading: boolean;
	grader_count: number;
	final_grader_id: number;
	grader_comments_visible_to_graders: boolean;
	graders_anonymous_to_graders: boolean;
	grader_names_visible_to_final_grader: boolean;
	anonymous_grading: boolean;
	allowed_attempts: number;
	post_manually: boolean;
	score_statistics?: any;
	can_submit?: boolean;
	ab_guid?: string[];
	annotatable_attachment_id: any;
	anonymize_students?: boolean;
	require_lockdown_browser?: boolean;
	important_dates?: boolean;
	muted?: boolean;
	anonymous_peer_reviews: boolean;
	anonymous_instructor_annotations: boolean;
	graded_submissions_exist: boolean;
	is_quiz_assignment: boolean;
	in_closed_grading_period: boolean;
	can_duplicate: boolean;
	original_course_id: number;
	original_assignment_id: number;
	original_lti_resource_link_id: number;
	original_assignment_name: string;
	original_quiz_id: number;
	workflow_state: workflow_state;
}
