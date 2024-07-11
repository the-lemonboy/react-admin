const res = {
  user: {
    id: 'b34719e1-ce46-457e-9575-99505ecee828',
    username: 'admin',
    email: 'Justen.Dibbert@gmail.com',
    avatar:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/427.jpg',
    createdAt: '2025-05-13T19:45:01.709Z',
    updatedAt: '2024-06-26T20:00:03.626Z',
    password: 'demo1234',
    role: {
      id: '4281707933534332',
      name: 'Admin',
      label: 'admin',
      status: 1,
      order: 1,
      desc: 'Super Admin',
      // permission: [
      //   {
      //     id: '0901673425580518',
      //     parentId: '',
      //     label: 'sys.menu.management',
      //     name: 'Management',
      //     icon: 'ic-management',
      //     type: 0,
      //     route: 'management',
      //     order: 2,
      //     children: [
      //       {
      //         id: '1985890042972845',
      //         parentId: '0249937641030250',
      //         label: 'sys.menu.system.website-management',
      //         name: 'website-management',
      //         type: 1,
      //         route: 'website-management',
      //         component: '/management/system/website-management/index.tsx',
      //       },
      //     ],
      //   },
      //   {
      //     id: '9406067785553476',
      //     parentId: '',
      //     label: 'sys.menu.error.index',
      //     name: 'Error',
      //     icon: 'bxs:error-alt',
      //     type: 0,
      //     route: 'error',
      //     order: 6,
      //     children: [
      //       {
      //         id: '8557056851997154',
      //         parentId: '9406067785553476',
      //         label: 'sys.menu.error.403',
      //         name: '403',
      //         type: 1,
      //         route: '403',
      //         component: '/sys/error/Page403.tsx',
      //       },
      //       {
      //         id: '5095669208159005',
      //         parentId: '9406067785553476',
      //         label: 'sys.menu.error.404',
      //         name: '404',
      //         type: 1,
      //         route: '404',
      //         component: '/sys/error/Page404.tsx',
      //       },
      //       {
      //         id: '0225992135973772',
      //         parentId: '9406067785553476',
      //         label: 'sys.menu.error.500',
      //         name: '500',
      //         type: 1,
      //         route: '500',
      //         component: '/sys/error/Page500.tsx',
      //       },
      //     ],
      //   },
      // ],
    },
    permissions: [
      {
        id: '0901673425580518',
        parentId: '',
        label: 'sys.menu.management',
        name: 'Management',
        icon: 'ic-management',
        type: 0,
        route: 'management',
        order: 1,
        children: [
          {
            id: '1985890042972845',
            parentId: '0901673425580518',
            label: 'sys.menu.system.website-management',
            name: 'website-management',
            type: 1,
            route: 'website-management',
            component: '/management/website-management/index.tsx',
          },
          {
            id: '1985890042972345',
            parentId: '0901673425580518',
            label: 'sys.menu.rssdao.member-level',
            name: 'member-level',
            type: 1,
            route: 'member-level',
            component: '/member/rssdao/member-level/index.tsx',
          },
          {
            id: '1985890042970926',
            parentId: '0901673425580518',
            label: 'sys.menu.rssdao.consumer-card',
            name: 'consumer-card',
            type: 1,
            route: 'consumer-card',
            component: '/member/rssdao/consumer-card/index.tsx',
          },
          {
            id: '1985890042972212',
            parentId: '0901673425580518',
            label: 'sys.menu.media-management',
            name: 'media-management',
            type: 1,
            route: 'media-management',
            component: '/news/media-management/index.tsx',
          },
          {
            id: '1985890042971524',
            parentId: '0901673425580518',
            label: 'sys.menu.theasaurus-tag',
            name: 'theasaurus-tag',
            type: 1,
            route: 'theasaurus-tag',
            component: '/news/theasaurus-tag/index.tsx',
          },
          {
            id: '1985890042971624',
            parentId: '0901673425580518',
            label: 'sys.menu.category-tag',
            name: 'category-tag',
            type: 1,
            route: 'category-tag',
            component: '/news/category-tag/index.tsx',
          },
        ],
      },
      {
        id: '090167342552323',
        parentId: '',
        label: 'sys.menu.member',
        name: 'Member',
        icon: 'ic-management',
        type: 0,
        route: 'member',
        order: 2,
        children: [
          {
            id: '1985890042972845',
            parentId: '090167342552323',
            label: 'sys.menu.rssdao.index',
            name: 'Rssdao',
            type: 0,
            route: 'rssdao',
            children: [
              {
                id: '1985890042972846',
                parentId: '1985890042972845',
                label: 'sys.menu.rssdao.consumer-card',
                name: 'consumer-card',
                type: 1,
                route: 'consumer-card',
                component: '/member/rssdao/consumer-card/index.tsx',
              },
              {
                id: '1985890042972847',
                parentId: '1985890042972845',
                label: 'sys.menu.rssdao.member-level',
                name: 'member-level',
                type: 1,
                route: 'member-level',
                component: '/member/rssdao/member-level/index.tsx',
              },
            ],
          },
          {
            id: '1985890042972848',
            parentId: '090167342552323',
            label: 'sys.menu.wechat.index',
            name: 'Wechat',
            type: 0,
            route: 'wechat',
            children: [
              {
                id: '1985890042972849',
                parentId: '1985890042972848',
                label: 'sys.menu.wechat.official-account',
                name: 'officia-account',
                type: 1,
                route: 'official-account',
                component: '/member/wechat/official-account/index.tsx',
              },
              {
                id: '1985890042972850',
                parentId: '1985890042972848',
                label: 'sys.menu.wechat.recharge-record',
                name: 'Recharge Record',
                type: 1,
                route: 'recharge-record',
                component: '/member/wechat/recharge-record/index.tsx',
              },
            ],
          },
        ],
      },
      {
        id: '9406067785553476',
        parentId: '',
        label: 'sys.menu.error.index',
        name: 'Error',
        icon: 'bxs:error-alt',
        type: 0,
        route: 'error',
        order: 6,
        children: [
          {
            id: '8557056851997154',
            parentId: '9406067785553476',
            label: 'sys.menu.error.403',
            name: '403',
            type: 1,
            route: '403',
            component: '/sys/error/Page403.tsx',
          },
          {
            id: '5095669208159005',
            parentId: '9406067785553476',
            label: 'sys.menu.error.404',
            name: '404',
            type: 1,
            route: '404',
            component: '/sys/error/Page404.tsx',
          },
          {
            id: '0225992135973772',
            parentId: '9406067785553476',
            label: 'sys.menu.error.500',
            name: '500',
            type: 1,
            route: '500',
            component: '/sys/error/Page500.tsx',
          },
        ],
      },
    ],
  },
  accessToken: 'fdd58661-f33a-4b32-bbe3-d070c53be03e',
  refreshToken: '833ac906-a759-4f58-a52a-954229800bb6',
};

export default res;