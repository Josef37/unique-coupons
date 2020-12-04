const data = {
	couponGroups: {
		1: {
			id: 1,
			name: "Group 1",
			description: "Group 1 Description",
			template: "This is a template for group 1",
			isActive: true,
			coupons : [
				{
					id: 1,
					value: "1-1",
					expiresAt: Date.now()
				},
				{
					id: 2,
					value: "1-2",
					expiresAt: Date.now()
				},
				{
					id: 3,
					value: "1-3",
					expiresAt: Date.now()
				}
			]
		},
		2: {
			id: 2,
			name: "Group 2",
			description: "Group 2 Description",
			template: "This is a template for group 2",
			isActive: true,
			coupons : [
				{
					id: 4,
					value: "2-1",
					expiresAt: Date.now()
				},
				{
					id: 5,
					value: "2-2",
					expiresAt: Date.now()
				},
				{
					id: 6,
					value: "2-3",
					expiresAt: Date.now()
				}
			]
		}
	}
}

export default data;
