variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-08c40ec9ead489470" # Ubuntu 22.04 LTS
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

// variable "subnet_id" {
//   type    = string
//   default = "subnet-00439420f62cbdced"
// }

// variable "vpc_id" {
//   type    = string
//   default = "vpc-029ce2a08ed69ecaf"
// }

variable "subnet_id" {
  type    = string
  default = "subnet-04d1fdbb8cfb23bd7"
}

variable "vpc_id" {
  type    = string
  default = "vpc-02a513cbe271ede39"
}

variable "aws_access_key" {
  type    = string
  default = ""
}

variable "aws_secret_key" {
  type    = string
  default = ""
}

# https://www.packer.io/plugins/builders/amazon/ebs
source "amazon-ebs" "my-ami" {
  access_key      = "${var.aws_access_key}"
  region          = "${var.aws_region}"
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_users       = [616161770875, 987729257471]
  ami_description = "AMI for CSYE 6225"
  ami_regions = [
    "us-east-1",
  ]
  secret_key    = "${var.aws_secret_key}"
  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"
  vpc_id        = "${var.vpc_id}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.my-ami"]

  provisioner "file" {
     source = "webapp.zip"
     destination = "~/webapp.zip"
  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]

    scripts = [
      "app-packer.sh"
    ]
  }

}
